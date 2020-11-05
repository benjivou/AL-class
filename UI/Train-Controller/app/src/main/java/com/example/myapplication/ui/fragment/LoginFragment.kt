package com.example.myapplication.ui.fragment

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.androidnetworking.AndroidNetworking
import com.androidnetworking.error.ANError
import com.androidnetworking.interfaces.JSONObjectRequestListener
import com.example.myapplication.R
import com.example.myapplication.data.models.User
import com.example.myapplication.databinding.FragmentLoginBinding
import com.example.myapplication.ui.viewmodels.ProfileViewModel
import org.json.JSONObject

/**
 * A simple [Fragment] subclass.
 * Use the [LoginFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
private const val TAG = "LoginFragment"

class LoginFragment : Fragment() {

    private val userViewModel: ProfileViewModel by activityViewModels()
    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentLoginBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.apply {
            connexionBtn.setOnClickListener {
                login()
            }
        }

    }

    private fun login() {
        AndroidNetworking
            .get("http://${getString(R.string.NODE_IP_ADDRESS)}:3001/authentification/getToken/{username}/{password}")
            .addPathParameter("username", binding.loginInputTxt.text.toString())
            .addPathParameter("password", binding.passwordInputTxt.text.toString())
            .build()
            .getAsJSONObject(object : JSONObjectRequestListener {
                override fun onResponse(response: JSONObject?) {
                    response?.run { // not a good authentification
                        if (response.has("message")) {
                            Toast.makeText(
                                requireContext(),
                                response.getString("message"),
                                Toast.LENGTH_LONG
                            ).show()
                        } else {
                            userViewModel.user.value = User(response.getString("token"))
                            findNavController().popBackStack()
                        }
                    } ?: kotlin.run {
                        Log.d(TAG, "onResponse: error response null")
                        Toast.makeText(
                            requireContext(),
                            "Mauvaise version d'application",
                            Toast.LENGTH_LONG
                        ).show()
                    }

                }

                override fun onError(anError: ANError?) {
                    Toast.makeText(
                        requireContext(),
                        getString(R.string.probleme_de_connexion),
                        Toast.LENGTH_LONG
                    ).show()
                    Log.e(TAG, "onError: ", anError)
                }

            })
    }


}